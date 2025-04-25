package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Status;
import com.springboot.MyTodoList.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    public List<Status> findAll() {
        return statusRepository.findAll();
    }

    public ResponseEntity<Status> getStatusById(int id) {
        Optional<Status> status = statusRepository.findById(id);
        if (status.isPresent()) {
            return new ResponseEntity<>(status.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public Status addStatus(Status status) {
        return statusRepository.save(status);
    }

    public boolean deleteStatus(int id) {
        if (statusRepository.existsById(id)) {
            statusRepository.deleteById(id);
            return true;
        }
        return false;
    }
}