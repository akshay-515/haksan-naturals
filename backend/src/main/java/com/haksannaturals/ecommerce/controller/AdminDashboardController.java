package com.haksannaturals.ecommerce.controller;

import com.haksannaturals.ecommerce.dto.AdminDashboardResponse;
import com.haksannaturals.ecommerce.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public AdminDashboardResponse getDashboardStats() {
        return adminDashboardService.getDashboardStats();
    }
}