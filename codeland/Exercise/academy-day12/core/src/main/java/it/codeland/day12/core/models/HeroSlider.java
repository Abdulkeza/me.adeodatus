package it.codeland.day12.core.models;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;

@Model(adaptables = Resource.class)
public class HeroSlider {

    @Inject
    @Named("img1")
    @Default(values = "https://via.placeholder.com/800x400?text=Image+10")
    private String img1;

    @Inject
    @Named("caption")
    @Default(values = "Not Available")
    private String caption;

    @Inject
    @Named("img2")
    @Default(values = "https://via.placeholder.com/800x400?text=Image+2")
    private String img2;

    @Inject
    @Named("caption2")
    @Default(values = "Not Available")
    private String caption2;

    @Inject
    @Named("img3")
    @Default(values = "https://via.placeholder.com/800x400?text=Image+2")
    private String img3;

    @Inject
    @Named("caption3")
    @Default(values = "Not Available")
    private String caption3;

    public String getImg1() {
        return img1;
    }

    public String getCaption() {
        return caption;
    }

    public String getImg2() {
        return img2;
    }

    public String getCaption2() {
        return caption2;
    }

    public String getImg3() {
        return img3;
    }

    public String getCaption3() {
        return caption3;
    }

}
