package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.TeamWorkingModule;
import com.springboot.MyTodoList.service.TeamWorkingModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team-working-modules")
@CrossOrigin(origins = "*")
public class TeamWorkingModuleController {

    @Autowired
    private TeamWorkingModuleService teamWorkingModuleService;

    @GetMapping
    public List<TeamWorkingModule> getAllTeamWorkingModules() {
        return teamWorkingModuleService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamWorkingModule> getTeamWorkingModuleById(@PathVariable int id) {
        try {
            ResponseEntity<TeamWorkingModule> responseEntity = teamWorkingModuleService.getTeamWorkingModuleById(id);
            return new ResponseEntity<>(responseEntity.getBody(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<TeamWorkingModule> addTeamWorkingModule(@RequestBody TeamWorkingModule teamWorkingModule) {
        TeamWorkingModule newTeamWorkingModule = teamWorkingModuleService.addTeamWorkingModule(teamWorkingModule);
        return new ResponseEntity<>(newTeamWorkingModule, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteTeamWorkingModule(@PathVariable int id) {
        boolean deleted = teamWorkingModuleService.deleteTeamWorkingModule(id);
        return new ResponseEntity<>(deleted, deleted ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }
}