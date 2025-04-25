package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Module;
import com.springboot.MyTodoList.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    public List<Module> findAll() {
        return moduleRepository.findAll();
    }

    public ResponseEntity<Module> getModuleById(int id) {
        Optional<Module> module = moduleRepository.findById(id);
        return module.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    public Module addModule(Module module) {
        return moduleRepository.save(module);
    }

    public boolean deleteModule(int id) {
        if (moduleRepository.existsById(id)) {
            moduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /*public Module updateModule(int id, Module updatedModule) {
        Optional<Module> existingModule = moduleRepository.findById(id);
        if (existingModule.isPresent()) {
            Module module = existingModule.get();
            FALTA ESTO
            return moduleRepository.save(module);
        }
        return null;
    }*/
}
