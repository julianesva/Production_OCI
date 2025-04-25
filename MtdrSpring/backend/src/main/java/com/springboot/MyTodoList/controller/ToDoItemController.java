package com.springboot.MyTodoList.controller;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ToDoItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.net.URI;
import java.util.List;

@RestController
public class ToDoItemController {
    @Autowired
    private ToDoItemService toDoItemService;
    //@CrossOrigin
    @GetMapping("/todolist")
    public List<ToDoItem> getToDoList() {
        try {
            return toDoItemService.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching ToDo items: " + e.getMessage(), e);
        }
    }

    //@CrossOrigin
    @GetMapping(value = "/test")
    public ResponseEntity<String> testToDoEndpoint() {
        System.out.println("✅ /todolist endpoint hit!");
        return ResponseEntity.ok("✅ Backend is up and /todolist is responding.");
    }
    //@CrossOrigin
    @GetMapping(value = "/todolist/{id}")
    public ResponseEntity<ToDoItem> getToDoItemById(@PathVariable int id){
        try{
            ResponseEntity<ToDoItem> responseEntity = toDoItemService.getItemById(id);
            return new ResponseEntity<ToDoItem>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @PostMapping(value = "/todolist")
    public ResponseEntity addToDoItem(@RequestBody ToDoItem todoItem) throws Exception{
        System.out.println("Received todoItemAQUIIIIIIIIIIIIIIIIIIIIIIIIIII: " + todoItem);
        ToDoItem td = toDoItemService.addToDoItem(todoItem);
        System.out.println("Story pointsAQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII: " + td.getStory_Points());
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("location",""+td.getId());
        responseHeaders.set("Access-Control-Expose-Headers","location");
        //URI location = URI.create(""+td.getID())

        return ResponseEntity.ok()
                .headers(responseHeaders).build();
    }
    //@CrossOrigin
    @PutMapping(value = "todolist/{id}")
    public ResponseEntity<ToDoItem> updateToDoItem(@RequestBody ToDoItem toDoItem, @PathVariable int id) {
        try {
            System.out.println("Received UPDATEtodoItemAQUIIIIIIIIIIIIIIIIIIIIIIIIIII: " + toDoItem);
            
            // Get the existing item as ResponseEntity
            ResponseEntity<ToDoItem> existingItemResponse = toDoItemService.getItemById(id);
            
            // Check if the existingItemResponse contains a valid item
            if (existingItemResponse.getBody() == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            
            // Extract the actual ToDoItem from the response
            ToDoItem existingItem = existingItemResponse.getBody();
            
            // Preserve the ID and creation timestamp
            toDoItem.setId(id);
            toDoItem.setCreation_ts(existingItem.getCreation_ts());
            
            // Update the item
            ToDoItem toDoItem1 = toDoItemService.updateToDoItem(id, toDoItem);
            System.out.println(toDoItem1.toString());
            
            return new ResponseEntity<>(toDoItem1, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    //@CrossOrigin
    @DeleteMapping(value = "todolist/{id}")
    public ResponseEntity<Boolean> deleteToDoItem(@PathVariable("id") int id){
        Boolean flag = false;
        try{
            flag = toDoItemService.deleteToDoItem(id);
            return new ResponseEntity<>(flag, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(flag,HttpStatus.NOT_FOUND);
        }
    }



}
