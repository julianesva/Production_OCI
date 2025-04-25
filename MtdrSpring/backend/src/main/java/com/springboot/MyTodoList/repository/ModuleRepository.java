package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import com.google.common.base.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    @Query("SELECT m FROM Module m LEFT JOIN FETCH m.tasks WHERE m.id = :id")
    Optional<Module> findModuleWithUserById(Integer id); // Removed @PathVariable annotation
}
