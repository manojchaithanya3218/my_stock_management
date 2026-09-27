package com.manoj.stock_management.repository;

import com.manoj.stock_management.entity.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<user, Long> {

    Optional<user> findByUsername(String username);
}