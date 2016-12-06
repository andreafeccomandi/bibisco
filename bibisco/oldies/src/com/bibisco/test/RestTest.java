package com.bibisco.test;

import java.net.URI;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

public class RestTest {
  public static void main(String[] args) {
    ClientConfig config = new DefaultClientConfig();
    Client client = Client.create(config);
    WebResource service = client.resource(getBaseURI());
    WebResource.Builder lBuilder = service.path("rest").path("hello").accept(MediaType.APPLICATION_JSON);
    System.out.println(lBuilder.get(String.class));

   lBuilder =  service.path("rest").path("hello/messages/1.0.0").accept(MediaType.TEXT_HTML);
   String lStrMessage = lBuilder.get(String.class);
   System.out.println(lStrMessage);
  }

  private static URI getBaseURI() {
    return UriBuilder.fromUri("http://localhost:8080/bibiscoWeb").build();
  }

} 