package com.manoj.stock_management.config;

import com.manoj.stock_management.entity.user;
import com.manoj.stock_management.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // =====================================================
        // ADMIN USER
        // =====================================================

        user admin = userRepository.findByUsername("admin")
                .orElseGet(user::new);

        admin.setUsername("admin");
        admin.setPassword(
                passwordEncoder.encode("Admin@123")
        );
        admin.setRole("ADMIN");

        userRepository.save(admin);

        System.out.println("=================================");
        System.out.println("ADMIN USER READY");
        System.out.println("Username: admin");
        System.out.println("Password: Admin@123");
        System.out.println("Role: ADMIN");
        System.out.println("=================================");


        // =====================================================
        // STAFF USER
        // =====================================================

        user staff = userRepository.findByUsername("staff")
                .orElseGet(user::new);

        staff.setUsername("staff");
        staff.setPassword(
                passwordEncoder.encode("Staff@123")
        );
        staff.setRole("STAFF");

        userRepository.save(staff);

        System.out.println("=================================");
        System.out.println("STAFF USER READY");
        System.out.println("Username: staff");
        System.out.println("Password: Staff@123");
        System.out.println("Role: STAFF");
        System.out.println("=================================");
    }
}