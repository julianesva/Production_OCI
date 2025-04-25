package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Module;
import com.springboot.MyTodoList.model.ToDoItem;
import com.springboot.MyTodoList.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modules")
@CrossOrigin(origins = "*") 
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @GetMapping
    public List<Module> getAllModules() {
        return moduleService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable int id) {
        try{
            ResponseEntity<Module> responseEntity = moduleService.getModuleById(id);
            return new ResponseEntity<Module>(responseEntity.getBody(), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Module> addModule(@RequestBody Module module) {
        Module newModule = moduleService.addModule(module);
        return new ResponseEntity<>(newModule, HttpStatus.CREATED);
    }

    /*@PutMapping("/{id}")
    public ResponseEntity<Module> updateModule(@PathVariable int id, @RequestBody Module module) {
        Module updatedModule = moduleService.updateModule(id, module);
        if (updatedModule != null) {
            return new ResponseEntity<>(updatedModule, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }*/

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteModule(@PathVariable int id) {
        boolean deleted = moduleService.deleteModule(id);
        return new ResponseEntity<>(deleted, deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}
