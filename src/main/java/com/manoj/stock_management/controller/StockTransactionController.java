package com.manoj.stock_management.controller;

import com.manoj.stock_management.entity.StockTransaction;
import com.manoj.stock_management.service.StockTransactionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockTransactionController {

    private final StockTransactionService stockTransactionService;

    public StockTransactionController(
            StockTransactionService stockTransactionService) {

        this.stockTransactionService = stockTransactionService;
    }

    // Stock IN - ADMIN and STAFF
    @PostMapping("/in/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public StockTransaction stockIn(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        return stockTransactionService.stockIn(productId, quantity);
    }

    // Stock OUT - ADMIN and STAFF
    @PostMapping("/out/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public StockTransaction stockOut(
            @PathVariable Long productId,
            @RequestParam int quantity) {

        return stockTransactionService.stockOut(productId, quantity);
    }

    // View transactions - ADMIN and STAFF
    @GetMapping("/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<StockTransaction> getTransactions() {
        return stockTransactionService.getAllTransactions();
    }
}