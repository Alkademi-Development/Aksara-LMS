const ALKADEMI = {
    "index": {
      title: {
        isDynamic: true,
        storePath: "setting.title",
        withSitename: false,
      },
      description: {
        isDynamic: true,
        storePath: "setting.meta.description",
        withStripHtml: false,
      },
      og: {
        title: {
          isDynamic: true,
          storePath: "setting.title",
          withSitename: false,
        },
        description: {
          isDynamic: true,
          storePath: "setting.meta.description",
          withStripHtml: false,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      twitter: {
        title: {
          isDynamic: true,
          storePath: "setting.title",
          withSitename: false,
        },
        description: {
          isDynamic: true,
          storePath: "setting.meta.description",
          withStripHtml: false,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      itemprop: {
        name: {
          isDynamic: true,
          storePath: "setting.title",
          withSitename: false,
        },
        description: {
          isDynamic: true,
          storePath: "setting.meta.description",
          withStripHtml: false,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      }
    },
    "dashboard": {
      title: {
        isDynamic: false,
        static: "Dashboard",
        withSitename: true,
      },
      og: {
        title: {
          isDynamic: false,
          static: "Dashboard",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      twitter: {
        title: {
          isDynamic: false,
          static: "Dashboard",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      itemprop: {
        name: {
          isDynamic: false,
          static: "Courses",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      }
    },
    "dashboard-classroom": {
      title: {
        isDynamic: false,
        static: "Kelas",
        withSitename: true,
      },
      og: {
        title: {
          isDynamic: false,
          static: "Kelas",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      twitter: {
        title: {
          isDynamic: false,
          static: "Kelas",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      itemprop: {
        name: {
          isDynamic: false,
          static: "Courses",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      }
    },
    "dashboard-classroom-slug": {
      title: {
        isDynamic: true,
        storePath: "class.data.name",
        compareTitle: ["slug", "class.data.slug"],
        withSitename: true,
      },
      description: {
        isDynamic: true,
        storePath: "class.data.description",
        withStripHtml: true,
      },
      og: {
        title: {
          isDynamic: true,
          storePath: "class.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "class.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "class.data.logo",
        }
      },
      twitter: {
        title: {
          isDynamic: true,
          storePath: "class.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "class.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "class.data.logo",
        }
      },
      itemprop: {
        name: {
          isDynamic: true,
          storePath: "class.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "class.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "class.data.logo",
        }
      }
    },
    "dashboard-classroom-slug-courses-slug": {
      title: {
        isDynamic: true,
        storePath: "course.data.name",
        compareTitle: ["slug", "course.data.slug"],
        withSitename: true,
      },
      description: {
        isDynamic: true,
        storePath: "course.data.description",
        withStripHtml: true,
      },
      og: {
        title: {
          isDynamic: true,
          storePath: "sass.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "sass.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "sass.data.logo",
        }
      },
      twitter: {
        title: {
          isDynamic: true,
          storePath: "sass.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "sass.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "sass.data.logo",
        }
      },
      itemprop: {
        name: {
          isDynamic: true,
          storePath: "sass.data.name",
          withSitename: true,
        },
        description: {
          isDynamic: true,
          storePath: "sass.data.description",
          withStripHtml: true,
        },
        image: {
          isDynamic: true,
          storePath: "sass.data.logo",
        }
      }
    },
    "dashboard-studio": {
      title: {
        isDynamic: false,
        static: "Studio",
        withSitename: true,
      },
      og: {
        title: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      twitter: {
        title: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      itemprop: {
        name: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      }
    },
    "dashboard-studio-compiler": {
      title: {
        isDynamic: false,
        static: "Studio",
        withSitename: true,
      },
      og: {
        title: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      twitter: {
        title: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      },
      itemprop: {
        name: {
          isDynamic: false,
          static: "Studio",
          withSitename: true,
        },
        image: {
          isDynamic: true,
          storePath: "setting.meta.image",
          isAddOrigin: true,
        },
      }
    },
}
  
export default ALKADEMI