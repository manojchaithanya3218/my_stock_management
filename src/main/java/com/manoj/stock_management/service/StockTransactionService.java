package com.manoj.stock_management.service;

import com.manoj.stock_management.entity.Product;
import com.manoj.stock_management.entity.StockTransaction;
import com.manoj.stock_management.repository.ProductRepository;
import com.manoj.stock_management.repository.StockTransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockTransactionService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository transactionRepository;

    public StockTransactionService(
            ProductRepository productRepository,
            StockTransactionRepository transactionRepository) {

        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    public StockTransaction stockIn(Long productId, int quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setQuantity(product.getQuantity() + quantity);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();

        transaction.setProductId(productId);
        transaction.setType("IN");
        transaction.setQuantity(quantity);
        transaction.setTransactionDate(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public StockTransaction stockOut(Long productId, int quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();

        transaction.setProductId(productId);
        transaction.setType("OUT");
        transaction.setQuantity(quantity);
        transaction.setTransactionDate(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public List<StockTransaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}