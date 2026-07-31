package com.musiccatalog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class RestClientConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // Add User-Agent header to prevent external APIs (like iTunes) from blocking requests
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            return execution.execute(request, body);
        });

        // Register text/javascript and text/plain MediaTypes for Jackson JSON converter (iTunes returns text/javascript)
        for (HttpMessageConverter<?> converter : restTemplate.getMessageConverters()) {
            if (converter instanceof MappingJackson2HttpMessageConverter jacksonConverter) {
                List<MediaType> supportedMediaTypes = new ArrayList<>(jacksonConverter.getSupportedMediaTypes());
                supportedMediaTypes.add(new MediaType("text", "javascript", StandardCharsets.UTF_8));
                supportedMediaTypes.add(new MediaType("text", "javascript"));
                supportedMediaTypes.add(new MediaType("application", "javascript"));
                supportedMediaTypes.add(MediaType.TEXT_PLAIN);
                jacksonConverter.setSupportedMediaTypes(supportedMediaTypes);
            }
        }

        return restTemplate;
    }

    @Bean
    public RestClient restClient() {
        return RestClient.create();
    }
}

