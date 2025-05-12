package com.springboot.MyTodoList.controller;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.springboot.MyTodoList.model.Employee;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.repository.EmployeeRepository;

@ExtendWith(MockitoExtension.class)
public class EmployeeControllerTest {
    @Mock
    private EmployeeRepository mockEmployeeRepository;

    private EmployeeController employeeController;
    private List<Employee> testEmployees;

    @BeforeEach
    void setUp() throws Exception {
        employeeController = new EmployeeController();
        java.lang.reflect.Field repositoryField = EmployeeController.class.getDeclaredField("employeeRepository");
        repositoryField.setAccessible(true);
        repositoryField.set(employeeController, mockEmployeeRepository);


        testEmployees = new ArrayList<>();
        

        Employee employee1 = new Employee();
        employee1.setId(1);
        employee1.setUserId(101);
        employee1.setTeamId(1);
        employee1.setRole("Developer");
       
        List<ToDoItem> tasks = new ArrayList<>();

        // Creamos las tareas y empleados, uno con tareas y otro sin tareas
        ToDoItem completedTask = new ToDoItem();
        completedTask.setId(1);
        completedTask.setTitle("Completed Task");
        completedTask.setDescription("This is a completed task");
        completedTask.setDone(true);
        completedTask.setCreation_ts(OffsetDateTime.now());
        completedTask.setResponsible(employee1.getId()); // Set the employee as responsible
        completedTask.setModuleId(1); // Set the module ID
        tasks.add(completedTask);

        ToDoItem incompleteTask = new ToDoItem();
        incompleteTask.setId(2);
        incompleteTask.setTitle("Incomplete Task");
        incompleteTask.setDescription("This is an incomplete task");
        incompleteTask.setDone(false);
        incompleteTask.setCreation_ts(OffsetDateTime.now());
        incompleteTask.setResponsible(employee1.getId()); // Set the employee as responsible
        incompleteTask.setModuleId(1); // Set the module ID
        tasks.add(incompleteTask);
        
        employee1.setTasks(tasks);
        testEmployees.add(employee1);
        
        Employee employee2 = new Employee();
        employee2.setId(2);
        employee2.setUserId(102);
        employee2.setTeamId(1);
        employee2.setRole("Designer");
        testEmployees.add(employee2);
    }

    @Test
    void testGetEmployeesWithTasksByManagerId_Success() {
        // Arrange
        when(mockEmployeeRepository.findEmployeesByTeamIdWithTasks(1)).thenReturn(testEmployees);

        // Act
        ResponseEntity<List<Employee>> response = employeeController.getEmployeesWithTasksByManagerId(1);
        List<Employee> employees = response.getBody();

        // Assert
        assertNotNull(employees);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, employees.size());
        
        // Verificar el empleado tenga tasks
        Employee firstEmployee = employees.get(0);
        assertEquals(2, firstEmployee.getTotalNumberTasks());
        assertEquals(1, firstEmployee.getNumberTasksCompleted());
        assertEquals(1, firstEmployee.getUncompletedTasks().size());
        
        //  el segundo empleado no debe tener 
        Employee secondEmployee = employees.get(1);
        assertEquals(0, secondEmployee.getTotalNumberTasks());
        assertEquals(0, secondEmployee.getNumberTasksCompleted());
        assertEquals(0, secondEmployee.getUncompletedTasks().size());
    }

    @Test
    void testGetEmployeesWithTasksByManagerId_NotFound() {
        // Arrange
        when(mockEmployeeRepository.findEmployeesByTeamIdWithTasks(999)).thenReturn(new ArrayList<>());

        // Act
        ResponseEntity<List<Employee>> response = employeeController.getEmployeesWithTasksByManagerId(999);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }
} 