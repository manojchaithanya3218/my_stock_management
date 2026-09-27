package com.manoj.stock_management.controller;

import com.manoj.stock_management.service.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Dashboard - ADMIN and STAFF
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public Map<String, Object> getDashboard() {
        return dashboardService.getDashboardData();
    }
}