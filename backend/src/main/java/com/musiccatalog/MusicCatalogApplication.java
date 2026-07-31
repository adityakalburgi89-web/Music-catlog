package com.musiccatalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@SpringBootApplication
@EnableCaching
public class MusicCatalogApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(MusicCatalogApplication.class, args);
    }

    private static void loadDotEnv() {
        File envFile = new File(".env");
        if (!envFile.exists()) {
            return;
        }
        try {
            Files.readAllLines(envFile.toPath()).forEach(line -> {
                String trimmed = line.trim();
                if (!trimmed.isEmpty() && !trimmed.startsWith("#")) {
                    String[] parts = trimmed.split("=", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                }
            });
        } catch (IOException ignored) {
        }
    }

}

