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
    @UniqueConstraint(name = "uq_user_apple_catalog", columnNames = {"user_id", "apple_catalog_id"})
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

    @Column(name = "apple_catalog_id", nullable = false)
    private Long appleCatalogId;

    @Column(nullable = false)
    private String title;

    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @Column(nullable = false, length = 100)
    private String genre;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "track_count", nullable = false)
    private Integer trackCount;

    @Column(name = "artwork_url", length = 500)
    private String artworkUrl;

    @Column(name = "collection_price", precision = 6, scale = 2)
    private BigDecimal collectionPrice;

    @Column(name = "download_url", length = 1024)
    private String downloadUrl;

    @Column(name = "user_rating")
    private Integer userRating; // 1 - 5 stars, nullable

    @Column(name = "user_notes", length = 1000)
    private String userNotes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
