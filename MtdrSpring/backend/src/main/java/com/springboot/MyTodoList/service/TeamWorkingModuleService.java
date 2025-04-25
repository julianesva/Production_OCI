// 4. TeamWorkingModule Service Implementation
package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.TeamWorkingModule;
import com.springboot.MyTodoList.repository.TeamWorkingModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamWorkingModuleService {

    @Autowired
    private TeamWorkingModuleRepository teamWorkingModuleRepository;

    public List<TeamWorkingModule> findAll() {
        return teamWorkingModuleRepository.findAll();
    }

    public ResponseEntity<TeamWorkingModule> getTeamWorkingModuleById(int id) {
        Optional<TeamWorkingModule> teamWorkingModule = teamWorkingModuleRepository.findById(id);
        if (teamWorkingModule.isPresent()) {
            return new ResponseEntity<>(teamWorkingModule.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public TeamWorkingModule addTeamWorkingModule(TeamWorkingModule teamWorkingModule) {
        return teamWorkingModuleRepository.save(teamWorkingModule);
    }

    public boolean deleteTeamWorkingModule(int id) {
        if (teamWorkingModuleRepository.existsById(id)) {
            teamWorkingModuleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}