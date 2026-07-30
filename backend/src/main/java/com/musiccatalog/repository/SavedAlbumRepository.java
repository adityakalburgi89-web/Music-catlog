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

    Optional<SavedAlbum> findByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);

    Boolean existsByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);

    List<SavedAlbum> findByUserId(Long userId);

    List<SavedAlbum> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(a) FROM SavedAlbum a WHERE a.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(a.trackCount), 0) FROM SavedAlbum a WHERE a.user.id = :userId")
    Long sumTrackCountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(AVG(a.userRating), 0.0) FROM SavedAlbum a WHERE a.user.id = :userId AND a.userRating IS NOT NULL")
    Double avgRatingByUserId(@Param("userId") Long userId);

    @Query("SELECT a.genre AS key, COUNT(a) AS val FROM SavedAlbum a WHERE a.user.id = :userId GROUP BY a.genre ORDER BY val DESC")
    List<Object[]> findGenreCountsByUserId(@Param("userId") Long userId);

    @Query("SELECT a.artistName AS key, COUNT(a) AS val FROM SavedAlbum a WHERE a.user.id = :userId GROUP BY a.artistName ORDER BY val DESC")
    List<Object[]> findArtistCountsByUserId(@Param("userId") Long userId);

    @Query("SELECT a.userRating AS key, COUNT(a) AS val FROM SavedAlbum a WHERE a.user.id = :userId AND a.userRating IS NOT NULL GROUP BY a.userRating ORDER BY a.userRating DESC")
    List<Object[]> findRatingCountsByUserId(@Param("userId") Long userId);

    @Query("SELECT a.releaseDate FROM SavedAlbum a WHERE a.user.id = :userId AND a.releaseDate IS NOT NULL")
    List<java.time.LocalDate> findReleaseDatesByUserId(@Param("userId") Long userId);
}
