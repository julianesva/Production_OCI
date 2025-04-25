package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.util.ChatGptClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskRecommendationService {

    @Autowired
    private ToDoItemRepository toDoItemRepository;

    @Autowired
    private ChatGptClient chatGptClient;

    public ToDoItem recommendTask() {
        List<ToDoItem> tasks_f = toDoItemRepository.findAll();
        for (ToDoItem task : tasks_f) {
            System.out.println(task);
        }
    
        List<ToDoItem> tasksWithDeadline = tasks_f.stream()
            .filter(task -> !task.isDone() && task.getDateLimit() != null)
            .collect(Collectors.toList());
    
        List<ToDoItem> tasks = !tasksWithDeadline.isEmpty() ? tasksWithDeadline : tasks_f;
    
        if (tasks.isEmpty()) return null;
    
        StringBuilder jsonPrompt = new StringBuilder();
        jsonPrompt.append("Tengo esta lista de tareas. Devuélveme SOLO el id de la tarea más prioritaria para trabajar ahora. No expliques. Prioriza tareas no hechas, con fecha límite más próxima y más story points si hay empate:\n\n");
        
        jsonPrompt.append("[\n");
        for (ToDoItem task : tasks) {  // Usar 'tasks', no 'tasks_f'
            jsonPrompt.append("  {\n")
                    .append("    \"id\": ").append(task.getId()).append(",\n")
                    .append("    \"title\": \"").append(task.getTitle()).append("\",\n")
                    .append("    \"done\": ").append(task.isDone()).append(",\n")
                    .append("    \"storyPoints\": ").append(task.getStory_Points()).append(",\n")
                    .append("    \"estimatedTime\": ").append(task.getEstimatedTime()).append(",\n");
            
            if (task.getDateLimit() != null) {
                jsonPrompt.append("    \"dateLimit\": \"").append(task.getDateLimit()).append("\"\n");
            } else {
                jsonPrompt.append("    \"dateLimit\": null\n");
            }
            
            jsonPrompt.append("  },\n");
        }
        jsonPrompt.deleteCharAt(jsonPrompt.lastIndexOf(","));
        jsonPrompt.append("]");
    
        String response = chatGptClient.askChatGpt(jsonPrompt.toString());
        System.out.println("Respuesta de ChatGPT: " + response);
    
        if (response.startsWith("Error")) {
            System.out.println("Usando fallback local para recomendación de tareas");
            return recommendTaskFallback(tasks);
        }
    
        int idSeleccionado = parseIdFromResponse(response);
        System.out.println("ID seleccionado por ChatGPT: " + idSeleccionado);
        
        if (idSeleccionado == -1) {
            System.out.println("No se pudo interpretar el ID. Usando fallback.");
            return recommendTaskFallback(tasks);
        }
        
        Optional<ToDoItem> selectedTask = toDoItemRepository.findById(idSeleccionado);
        return selectedTask.orElseGet(() -> {
            System.out.println("No se encontró la tarea con ID " + idSeleccionado + ". Usando fallback.");
            return recommendTaskFallback(tasks);
        });
    }

    public ToDoItem recommendTaskFallback(List<ToDoItem> tasks) {
        List<ToDoItem> pendingTasks = tasks.stream()
                .filter(task -> !task.isDone())
                .collect(Collectors.toList());
        
        if (pendingTasks.isEmpty()) {
            return tasks.isEmpty() ? null : tasks.get(tasks.size() - 1);
        }

        pendingTasks.sort((t1, t2) -> {
            if (t1.getDateLimit() == null && t2.getDateLimit() == null) return 0;
            if (t1.getDateLimit() == null) return 1;
            if (t2.getDateLimit() == null) return -1;
            return t1.getDateLimit().compareTo(t2.getDateLimit());
        });

        List<ToDoItem> sameDateTasks = new ArrayList<>();
        LocalDate firstDate = pendingTasks.get(0).getDateLimit();

        for (ToDoItem task : pendingTasks) {
            if (task.getDateLimit() != null && 
                (firstDate == null || task.getDateLimit().equals(firstDate))) {
                sameDateTasks.add(task);
            } else {
                break;
            }
        }
        
        if (sameDateTasks.size() > 1) {
            sameDateTasks.sort((t1, t2) -> 
                    Integer.compare(t2.getStory_Points(), t1.getStory_Points()));
            
            List<ToDoItem> samePointsTasks = new ArrayList<>();
            int highestPoints = sameDateTasks.get(0).getStory_Points();
            
            for (ToDoItem task : sameDateTasks) {
                if (task.getStory_Points() == highestPoints) {
                    samePointsTasks.add(task);
                } else {
                    break;
                }
            }
            
            if (samePointsTasks.size() > 1) {
                samePointsTasks.sort((t1, t2) -> 
                        Integer.compare(t1.getEstimatedTime(), t2.getEstimatedTime()));
                return samePointsTasks.get(0);
            }
            
            return sameDateTasks.get(0);
        }
        
        return pendingTasks.get(0);
    } 
    private int parseIdFromResponse(String response) {
        try {
            String[] words = response.split("\\s+");
            for (String word : words) {
                if (word.matches("\\d+")) {
                    return Integer.parseInt(word);
                }
            }
            

            String digitsOnly = response.replaceAll("[^0-9]", "");
            if (!digitsOnly.isEmpty()) {
                return Integer.parseInt(digitsOnly);
            }
            
            System.out.println("No se encontró ningún ID numérico en: " + response);
            return -1;
        } catch (NumberFormatException e) {
            System.out.println("No se pudo interpretar el ID: " + response);
            return -1;
        }
    }
}
