package it.codeland.aem.asc.visualsearch.addon.core.configs;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Visual Search Configuration | asset-share-commons", description = "Configuration for Visual Search in asset-share-commons")
public @interface VisualSearchConfig {

    @AttributeDefinition(name = "Root DAM Path", description = "Root path of the DAM where visual search images are stored")
    String root_dam_path() default "/content/dam/visualsearch";

    @AttributeDefinition(name = "Web service URL for creating embeddings", description = "Web service URL for creating embeddings")    
    String web_service_url_insert() default "https://mysterio.codeland.it/insert_asset";

    @AttributeDefinition(name = "Web service URL for getting similar images", description = "Web service URL for getting similar images")
    String web_service_url_get() default "https://mysterio.codeland.it/get_nearest_neighbors";

    @AttributeDefinition(name = "Web service URL for one-time text | image search", description = "Web service URL for one-time image or text search") 
    String web_service_url_temporary_search() default "https://mysterio.codeland.it/get_temporary_neighbors";

    @AttributeDefinition(name = "Username", description = "Basic Auth Username")
    String username() default "golem";

    @AttributeDefinition(name = "Password", description = "Basic Auth Password")
    String password() default "washere";
    

}
