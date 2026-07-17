package com.sarvesh.sidequest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // If true, it's a default category for everyone. If false, it's a user's custom category.
    @Builder.Default
    private boolean isDefault = false;

    // If this is a custom category, this links it to the user who made it.
    // We use FetchType.LAZY so we don't accidentally load the entire user object when we just want the category name.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}