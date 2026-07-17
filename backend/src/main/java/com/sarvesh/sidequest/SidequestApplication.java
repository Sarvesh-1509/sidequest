package com.sarvesh.sidequest;

import com.sarvesh.sidequest.entity.Category;
import com.sarvesh.sidequest.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.TimeZone;

@SpringBootApplication
public class SidequestApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        SpringApplication.run(SidequestApplication.class, args);
    }

    @Bean
    CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            // Only add default categories if the table is completely empty
            if (categoryRepository.count() == 0) {
                List<Category> defaultCategories = List.of(
                        Category.builder().name("Fitness").isDefault(true).build(),
                        Category.builder().name("Learning").isDefault(true).build(),
                        Category.builder().name("Career").isDefault(true).build(),
                        Category.builder().name("Health").isDefault(true).build(),
                        Category.builder().name("Finance").isDefault(true).build()
                );
                categoryRepository.saveAll(defaultCategories);
                System.out.println("Default categories successfully seeded into the database!");
            }
        };
    }
}