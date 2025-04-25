package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.TeamWorkingModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamWorkingModuleRepository extends JpaRepository<TeamWorkingModule, Integer> {
}
