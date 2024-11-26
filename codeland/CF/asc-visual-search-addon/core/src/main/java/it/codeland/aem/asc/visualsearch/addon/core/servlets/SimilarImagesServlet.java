package it.codeland.aem.asc.visualsearch.addon.core.servlets;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import it.codeland.aem.asc.visualsearch.addon.core.configs.VisualSearchConfigService;

import javax.servlet.Servlet;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component(service = Servlet.class, property = {
        Constants.SERVICE_DESCRIPTION + "=Similar Images Search Servlet",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths=" + "/bin/visualsearch/get_nearest_neighbors"
})
public class SimilarImagesServlet extends SlingAllMethodsServlet {

    private static final Logger log = LoggerFactory.getLogger(SimilarImagesServlet.class);

    @Reference
    private VisualSearchConfigService configService;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        log.info("Received request to fetch similar images ");

        String imagePath = request.getParameter("path");
        String useAscTable = request.getParameter("asc_request");

        if (imagePath == null || imagePath.isEmpty()) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Image path is required\"}");
            return;
        }

        // Build the Flask API URL
        String apiUrl = configService.getWebServiceUrlGet() + "?asc_request=" + useAscTable + "&path=" + imagePath;
        String flaskResponse = callFlaskApi(apiUrl, configService.getUsername(), configService.getPassword());
    

        if (flaskResponse != null) {
            response.setContentType("application/json");
            response.getWriter().write(flaskResponse);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to fetch data from Flask service\"}");
        }
    }

    private String callFlaskApi(String apiUrl, String username, String password) {
        CredentialsProvider provider = new BasicCredentialsProvider();
        provider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(username, password));

        try (CloseableHttpClient client = HttpClients.custom().setDefaultCredentialsProvider(provider).build()) {
            HttpGet request = new HttpGet(apiUrl);
            HttpResponse response = client.execute(request);

            if (response.getStatusLine().getStatusCode() == 200) {
                return IOUtils.toString(response.getEntity().getContent(), StandardCharsets.UTF_8);
            } else {
                log.error("Error calling Flask API: " + response.getStatusLine());
            }
        } catch (IOException e) {
            log.error("Exception while calling Flask API", e);
        }
        return null;
    }
}
