const projectSchema = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Project Title',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title' },
      },
      {
        name: 'mainImage',
        title: 'Background Image',
        type: 'image',
        options: { hotspot: true },
      },
      {
          name: 'order',
          title: 'Order',
          type: 'number',
      },
      {
        name: 'isProtected',
        title: 'Password Protected?',
        type: 'boolean',
        initialValue: false,
      },
    ],
  };
  
  export default projectSchema;