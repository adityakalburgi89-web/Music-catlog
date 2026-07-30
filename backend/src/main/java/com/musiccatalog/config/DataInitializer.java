package com.musiccatalog.config;

import com.musiccatalog.entity.SavedAlbum;
import com.musiccatalog.entity.User;
import com.musiccatalog.repository.SavedAlbumRepository;
import com.musiccatalog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SavedAlbumRepository savedAlbumRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@musiccatalog.com")) {
            log.info("Seeding demo admin account and sample catalog...");

            User demoUser = User.builder()
                    .email("demo@claymusic.com")
                    .password(passwordEncoder.encode("demo1234"))
                    .name("Demo Architect")
                    .build();

            User savedUser = userRepository.save(demoUser);

            if (!userRepository.existsByEmail("admin@musiccatalog.com")) {
                User adminUser = User.builder()
                        .email("admin@musiccatalog.com")
                        .password(passwordEncoder.encode("password123"))
                        .name("Catalog Admin")
                        .build();
                userRepository.save(adminUser);
            }


            SavedAlbum album1 = SavedAlbum.builder()
                    .user(savedUser)
                    .appleCatalogId(617154241L)
                    .title("Random Access Memories")
                    .artistName("Daft Punk")
                    .genre("Electronic")
                    .releaseDate(LocalDate.of(2013, 5, 17))
                    .trackCount(13)
                    .collectionPrice(new BigDecimal("11.99"))
                    .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a4/c8/ce/a4c8cefc-b6e8-0b5c-4f7f-d38df81c8172/886443927087.jpg/100x100bb.jpg")
                    .userRating(5)
                    .userNotes("Masterpiece production and analog synth integration.")
                    .build();

            SavedAlbum album2 = SavedAlbum.builder()
                    .user(savedUser)
                    .appleCatalogId(372732701L)
                    .title("The Dark Side of the Moon")
                    .artistName("Pink Floyd")
                    .genre("Rock")
                    .releaseDate(LocalDate.of(1973, 3, 1))
                    .trackCount(10)
                    .collectionPrice(new BigDecimal("9.99"))
                    .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ad/bb/df/adbbdfd9-4d6d-2d4e-b541-11d27fb2e293/00509990289825.jpg/100x100bb.jpg")
                    .userRating(5)
                    .userNotes("Timeless concept album with legendary production quality.")
                    .build();

            SavedAlbum album3 = SavedAlbum.builder()
                    .user(savedUser)
                    .appleCatalogId(1440841363L)
                    .title("Kid A")
                    .artistName("Radiohead")
                    .genre("Alternative")
                    .releaseDate(LocalDate.of(2000, 10, 2))
                    .trackCount(10)
                    .collectionPrice(new BigDecimal("10.99"))
                    .artworkUrl("https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/91/3d/8c/913d8c1c-4b5a-4e2b-bf2d-86f2bc8f42d2/634904015622.jpg/100x100bb.jpg")
                    .userRating(4)
                    .userNotes("Experimental electronic-rock fusion.")
                    .build();

            savedAlbumRepository.save(album1);
            savedAlbumRepository.save(album2);
            savedAlbumRepository.save(album3);

            log.info("Demo user successfully created: admin@musiccatalog.com / password123");
        }
    }
}
