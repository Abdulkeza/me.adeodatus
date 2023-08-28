package it.codeland.day12.core.models;

import org.apache.sling.api.resource.Resource;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import com.day.cq.wcm.api.Page;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AcademyLearningDemo {

    @Inject
    @Named("jcr:title")
    private String title;

    @Inject
    @Optional
    private String customDescription;

    @ScriptVariable
    Page currentPage;

    @PostConstruct
    protected void init() {
        // title = currentPage.getPageTitle();
        if (customDescription != null) {
            customDescription = customDescription.toUpperCase();
        } else {
            customDescription = "Not Available";
        }

        if (title == null) {
            title = "Title";
        }
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCustomDescription() {
        return customDescription;
    }

    public void setCustomDescription(String customDescription) {
        this.customDescription = customDescription;
    }
}
