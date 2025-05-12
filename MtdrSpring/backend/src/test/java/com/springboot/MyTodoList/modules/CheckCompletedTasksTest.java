package com.springboot.MyTodoList.modules;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Field;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.controller.ModuleController;
import com.springboot.MyTodoList.model.Module;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ModuleService;

@ExtendWith(MockitoExtension.class)
public class CheckCompletedTasksTest {
    @Mock
    private ModuleService mockModuleService;

    private ModuleController moduleController;
    private Module testModule;
    private Set<ToDoItem> testTasks;

    @BeforeEach
    void setUp() throws Exception {
        moduleController = new ModuleController();

        Field moduleServiceField = ModuleController.class.getDeclaredField("moduleService");
        moduleServiceField.setAccessible(true);
        moduleServiceField.set(moduleController, mockModuleService);

        // Creamos un modulo de prueba
        testModule = new Module();
        testModule.setId(1);
        testModule.setTitle("Sprint Module");
        testModule.setBody("Test Sprint Module");

        testTasks = new HashSet<>();
        
        // Creamos una tarea completada
        ToDoItem completedTask = new ToDoItem();
        completedTask.setId(1);
        completedTask.setTitle("Completed Task");
        completedTask.setModuleId(1);
        completedTask.setDescription("This is a completed task");
        completedTask.setDone(true);
        completedTask.setCreation_ts(OffsetDateTime.now());
        testTasks.add(completedTask);

        // Y una tarea incompleta
        ToDoItem incompleteTask = new ToDoItem();
        incompleteTask.setId(2);
        incompleteTask.setTitle("Incomplete Task");
        incompleteTask.setModuleId(1);
        incompleteTask.setDescription("This is an incomplete task");
        incompleteTask.setDone(false);
        incompleteTask.setCreation_ts(OffsetDateTime.now());
        testTasks.add(incompleteTask);

        testModule.setTasks(testTasks);
    }

    @Test
    void testGetModuleWithCompletedTasks() {
        when(mockModuleService.getModuleById(1)).thenReturn(ResponseEntity.ok(testModule));

        // Act
        ResponseEntity<Module> response = moduleController.getModuleById(1);
        Module module = response.getBody();

        // Assert
        assertNotNull(module);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Sprint Module", module.getTitle());
        
        // Check completed tasks
        Set<ToDoItem> completedTasks = module.getTasks().stream()
            .filter(ToDoItem::isDone)
            .collect(java.util.stream.Collectors.toSet());
        
        assertEquals(1, completedTasks.size());
        ToDoItem completedTask = completedTasks.iterator().next();
        assertEquals("Completed Task", completedTask.getTitle());
        assertTrue(completedTask.isDone());
    }

    @Test
    void testGetModuleWithIncompleteTasks() {
        // Arrange
        when(mockModuleService.getModuleById(1)).thenReturn(ResponseEntity.ok(testModule));

        // Act
        ResponseEntity<Module> response = moduleController.getModuleById(1);
        Module module = response.getBody();

        // Assert
        assertNotNull(module);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Sprint Module", module.getTitle());
        
        // Check incomplete tasks
        Set<ToDoItem> incompleteTasks = module.getTasks().stream()
            .filter(task -> !task.isDone())
            .collect(java.util.stream.Collectors.toSet());
        
        assertEquals(1, incompleteTasks.size());
        ToDoItem incompleteTask = incompleteTasks.iterator().next();
        assertEquals("Incomplete Task", incompleteTask.getTitle());
        assertFalse(incompleteTask.isDone());
    }

    // @Test
    // void testGetModuleNotFound() {
    //     // Arrange
    //     when(mockModuleService.getModuleById(999)).thenReturn(new ResponseEntity<>(HttpStatus.NOT_FOUND));

    //     // Act
    //     ResponseEntity<Module> response = moduleController.getModuleById(999);

    //     // Assert
    //     assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    //     assertNull(response.getBody());
    // }
}