package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ToDoItemService {

    @Autowired
    private ToDoItemRepository toDoItemRepository;
    public List<ToDoItem> findAll(){
        System.out.println("TODOITEMS NOT YET IN THE BASKETTTTTTTTTTTTTT______TODO_ITEM_SERVICE");
        List<ToDoItem> todoItems = toDoItemRepository.findAll();
        System.out.println("Received todoItemAQUIIIIIIIIIIIIIIIIIIIIIIIIIII____TODO_ITEM_SERVICE: " + todoItems);
        return todoItems;
    }
    public ResponseEntity<ToDoItem> getItemById(int id){
        Optional<ToDoItem> todoData = toDoItemRepository.findById(id);
        if (todoData.isPresent()){
            return new ResponseEntity<>(todoData.get(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public ToDoItem addToDoItem(ToDoItem toDoItem){
        System.out.println("DOUBLE CHECKING DATE SET");
        toDoItem.setCreation_ts(OffsetDateTime.now());
        System.out.println("DATE SET WORKING CORRECTLY");
        return toDoItemRepository.save(toDoItem);
    }

    public boolean deleteToDoItem(int id){
        try{
            toDoItemRepository.deleteById(id);
            return true;
        }catch(Exception e){
            return false;
        }
    }
    public ToDoItem updateToDoItem(int id, ToDoItem td){
        Optional<ToDoItem> toDoItemData = toDoItemRepository.findById(id);
        if(toDoItemData.isPresent()){
            ToDoItem toDoItem = toDoItemData.get();
            toDoItem.setTitle(td.getTitle());
            toDoItem.setModuleId(td.getModuleId());
            toDoItem.setDescription(td.getDescription());
            toDoItem.setDateLimit(td.getDateLimit());
            toDoItem.setResponsible(td.getResponsible());
            toDoItem.setEndingDate(td.getEndingDate());
            toDoItem.setEstimatedTime(td.getEstimatedTime());
            toDoItem.setActualTime(td.getActualTime());
            toDoItem.setDone(td.isDone());
            toDoItem.setStory_Points(td.getStory_Points());
            return toDoItemRepository.save(toDoItem);
        }else{
            return null;
        }
    }

}
