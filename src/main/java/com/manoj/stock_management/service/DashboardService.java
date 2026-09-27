package com.manoj.stock_management.service;

import com.manoj.stock_management.entity.Product;
import com.manoj.stock_management.repository.ProductRepository;
import com.manoj.stock_management.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;

    public DashboardService(
            ProductRepository productRepository,
            StockTransactionRepository transactionRepository) {

        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getDashboardData() {

        List<Product> products = productRepository.findAll();

        int totalProducts = products.size();

        int totalStock = products.stream()
                .mapToInt(Product::getQuantity)
                .sum();

        long lowStockProducts = products.stream()
                .filter(product ->
                        product.getQuantity() <= product.getMinimumStock())
                .count();

        long totalTransactions = transactionRepository.count();

        Map<String, Object> dashboard = new HashMap<>();

        dashboard.put("totalProducts", totalProducts);
        dashboard.put("totalStock", totalStock);
        dashboard.put("lowStockProducts", lowStockProducts);
        dashboard.put("totalTransactions", totalTransactions);

        return dashboard;
    }
}