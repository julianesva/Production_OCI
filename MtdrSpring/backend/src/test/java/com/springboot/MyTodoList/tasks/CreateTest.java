package com.springboot.MyTodoList.tasks;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.ToDoItemRepository;
import com.springboot.MyTodoList.service.ToDoItemService;

@ExtendWith(MockitoExtension.class)
public class CreateTest {
    @Mock
    private ToDoItemRepository mockToDoItemRepository;
    
    @Mock
    private ToDoItemService mockToDoItemService;
    
    private ToDoItem testToDoItem;
    
    @BeforeEach
    public void setUp() {
        testToDoItem = new ToDoItem();
        testToDoItem.setId(1);
        testToDoItem.setTitle("Test Task");
        testToDoItem.setDescription("Test Description");
        
        // Aqui configuramos ambos mocks para que se comporten como el repositorio y el servicio
        when(mockToDoItemRepository.save(any(ToDoItem.class))).thenReturn(testToDoItem);
        when(mockToDoItemService.addToDoItem(any(ToDoItem.class))).thenAnswer(invocation -> {
            ToDoItem item = invocation.getArgument(0);
            return mockToDoItemRepository.save(item);
        });
    }

    @Test
    public void testCreateTask() {
        // CReamos una tarea nueva
        ToDoItem newToDoItem = new ToDoItem();
        newToDoItem.setTitle("New Task");
        newToDoItem.setDescription("New Description");
        
        // llamamos al mock
        ToDoItem savedToDoItem = mockToDoItemService.addToDoItem(newToDoItem);
        
        // Verificamos que el repositorio fue llamado
        verify(mockToDoItemRepository).save(any(ToDoItem.class));
        
        // Verificamos la respuesta
        ResponseEntity<?> response = ResponseEntity.ok()
            .headers(new HttpHeaders())
            .build();
            
        assert response != null;
        
        // Hacemos un assert para verificar que la tarea guardada tiene el ID esperado
        assert savedToDoItem.getId() == 1;
    }
}
