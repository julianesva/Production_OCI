package com.springboot.MyTodoList.util;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class ChatGptClient {

    private final WebClient webClient;

    @Value("${openai.api.key}")
    private String apiKey;

    public ChatGptClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.openai.com/v1").build();
    }

    public String askChatGpt(String prompt) {
        ObjectMapper mapper = new ObjectMapper();
    
        try {
            ObjectNode message = mapper.createObjectNode();
            message.put("role", "user");
            message.put("content", prompt);
    
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", "gpt-3.5-turbo");
            requestBody.set("messages", mapper.createArrayNode().add(message));
    
            return webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(mapper.writeValueAsString(requestBody))
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    System.out.println("RESPUESTA RAW:\n" + response);
                    try {
                        JsonNode root = mapper.readTree(response);
                        JsonNode content = root.path("choices").get(0).path("message").path("content");
                        return content.asText().trim();
                    } catch (Exception e) {
                        System.err.println("Error al parsear la respuesta: " + e.getMessage());
                        e.printStackTrace();
                        return "No se pudo interpretar la respuesta: " + e.getMessage();
                    }
                })
                .onErrorResume(error -> {
                    System.err.println("Error en la comunicación con ChatGPT: " + error.getMessage());
                    error.printStackTrace();
                    return reactor.core.publisher.Mono.just("Error al comunicarse con ChatGPT: " + error.getMessage());
                })
                .block();
        } catch (Exception e) {
            System.err.println("Error al construir el request: " + e.getMessage());
            e.printStackTrace();
            return "Error al construir el cuerpo del request: " + e.getMessage();
        }
    }
}
