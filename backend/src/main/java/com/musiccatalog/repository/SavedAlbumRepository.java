package com.musiccatalog.repository;

import com.musiccatalog.entity.SavedAlbum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedAlbumRepository extends JpaRepository<SavedAlbum, Long> {

    Page<SavedAlbum> findByUserId(Long userId, Pageable pageable);

    Page<SavedAlbum> findByUserIdAndGenre(Long userId, String genre, Pageable pageable);

    Optional<SavedAlbum> findByIdAndUserId(Long id, Long userId);

    Optional<SavedAlbum> findByUserIdAndItunesCollectionId(Long userId, Long itunesCollectionId);

    Boolean existsByUserIdAndItunesCollectionId(Long userId, Long itunesCollectionId);

    List<SavedAlbum> findByUserId(Long userId);

    @Query("SELECT COUNT(a) FROM SavedAlbum a WHERE a.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(a.trackCount), 0) FROM SavedAlbum a WHERE a.user.id = :userId")
    Long sumTrackCountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(AVG(a.rating), 0.0) FROM SavedAlbum a WHERE a.user.id = :userId AND a.rating IS NOT NULL")
    Double avgRatingByUserId(@Param("userId") Long userId);

    @Query("SELECT a.genre AS genre, COUNT(a) AS count FROM SavedAlbum a WHERE a.user.id = :userId GROUP BY a.genre ORDER BY count DESC")
    List<Object[]> findGenreDistributionByUserId(@Param("userId") Long userId);

    @Query("SELECT a.releaseDate AS releaseDate FROM SavedAlbum a WHERE a.user.id = :userId AND a.releaseDate IS NOT NULL")
    List<java.time.LocalDate> findReleaseDatesByUserId(@Param("userId") Long userId);

    @Query("SELECT a.rating AS rating, COUNT(a) AS count FROM SavedAlbum a WHERE a.user.id = :userId AND a.rating IS NOT NULL GROUP BY a.rating ORDER BY a.rating DESC")
    List<Object[]> findRatingDistributionByUserId(@Param("userId") Long userId);

    @Query("SELECT a.artist AS artist, COUNT(a) AS count FROM SavedAlbum a WHERE a.user.id = :userId GROUP BY a.artist ORDER BY count DESC")
    List<Object[]> findTopArtistsByUserId(@Param("userId") Long userId);
}
