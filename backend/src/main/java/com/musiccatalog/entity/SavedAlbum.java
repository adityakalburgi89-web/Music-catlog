package com.musiccatalog.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_albums", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_itunes_collection", columnNames = {"user_id", "itunes_collection_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedAlbum {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "itunes_collection_id", nullable = false)
    private Long itunesCollectionId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false, length = 100)
    private String genre;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "track_count", nullable = false)
    private Integer trackCount;

    @Column(precision = 6, scale = 2)
    private BigDecimal price;

    @Column(name = "artwork_url", length = 500)
    private String artworkUrl;

    @Column
    private Integer rating; // 1 - 5 stars

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
