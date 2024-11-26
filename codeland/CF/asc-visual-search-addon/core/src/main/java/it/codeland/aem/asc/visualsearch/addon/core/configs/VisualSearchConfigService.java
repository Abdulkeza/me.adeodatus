package it.codeland.aem.asc.visualsearch.addon.core.configs;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;

@Component(service = VisualSearchConfigService.class, immediate = true)
@Designate(ocd = VisualSearchConfig.class)
public class VisualSearchConfigService {

    private volatile String rootDamPath;
    private volatile String webServiceUrlInsert;
    private volatile String webServiceUrlGet;
    private volatile String webServiceUrlTemporarySearch;
    private volatile String username;
    private volatile String password;

    @Activate
    @Modified
    protected void activate(final VisualSearchConfig config) {
        this.rootDamPath = config.root_dam_path();
        this.webServiceUrlInsert = config.web_service_url_insert();
        this.webServiceUrlGet = config.web_service_url_get();
        this.webServiceUrlTemporarySearch = config.web_service_url_temporary_search();
        this.username = config.username();
        this.password = config.password();
    }

    public String getRootDamPath() {
        return rootDamPath;
    }

    public String getWebServiceUrlInsert() {
        return webServiceUrlInsert;
    }

    public String getWebServiceUrlGet() {
        return webServiceUrlGet;
    }

    public String getWebServiceUrlTemporarySearch() { 
        return webServiceUrlTemporarySearch;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
