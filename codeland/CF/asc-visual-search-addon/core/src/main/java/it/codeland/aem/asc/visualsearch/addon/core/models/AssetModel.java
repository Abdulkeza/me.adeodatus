package it.codeland.aem.asc.visualsearch.addon.core.models;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.commons.util.DamUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Model(adaptables = {SlingHttpServletRequest.class, Resource.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AssetModel {

    private static final Logger LOG = LoggerFactory.getLogger(AssetModel.class);

    private String assetPath;

    @Inject
    private Resource resource;

    public AssetModel() {
        // Default constructor for Sling Models via Use API
    }

    @PostConstruct
    protected void init() {
        if (resource != null) {
            LOG.info("Resolving asset from resource: {}", resource.getPath());
            Asset asset = DamUtil.resolveToAsset(resource);
            if (asset != null) {
                assetPath = asset.getPath();
                LOG.info("Asset Path resolved: {}", assetPath);
            } else {
                LOG.warn("No asset could be resolved for the given resource.");
            }
        } else {
            LOG.error("Resource is null. Cannot resolve asset.");
        }
    }

    public String getAssetPath() {
        return assetPath;
    }
}

