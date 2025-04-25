package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Status;
import com.springboot.MyTodoList.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/status")
@CrossOrigin(origins = "*")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @GetMapping
    public List<Status> getAllStatuses() {
        return statusService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Status> getStatusById(@PathVariable int id) {
        try {
            ResponseEntity<Status> responseEntity = statusService.getStatusById(id);
            return new ResponseEntity<>(responseEntity.getBody(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Status> addStatus(@RequestBody Status status) {
        Status newStatus = statusService.addStatus(status);
        return new ResponseEntity<>(newStatus, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteStatus(@PathVariable int id) {
        boolean deleted = statusService.deleteStatus(id);
        return new ResponseEntity<>(deleted, deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}