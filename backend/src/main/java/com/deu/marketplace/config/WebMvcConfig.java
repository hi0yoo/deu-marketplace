package com.deu.marketplace.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

	@Value("${server.host.front}")
//	@Value("http://localhost:3000")
	private String frontHost;

	private final long MAX_AGE_SECS = 3600;


	@Override
	public void addCorsMappings(CorsRegistry registry) {
		System.out.println("frontHost = " + frontHost);
		registry.addMapping("/**")
//				.allowedOrigins("http://localhost:3000")
//				.allowedOrigins("http://13.209.99.188:3000")
				.allowedOrigins(frontHost)
				.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
				.allowedHeaders("*")
				.allowCredentials(true)
				.maxAge(MAX_AGE_SECS);
	}

}
