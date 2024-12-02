# PawSpace Documentation

This directory contains both API documentation (Sphinx) and user documentation (MkDocs).

## Structure

```
docs/
├── sphinx/              # API documentation (Sphinx)
│   ├── api/            # API reference docs
│   ├── _static/        # Static files (CSS, images)
│   └── conf.py         # Sphinx configuration
├── user-guide/         # User documentation (MkDocs)
├── requirements.txt    # Documentation dependencies
└── build_docs.py       # Build script
```

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Build documentation:
   ```bash
   python build_docs.py
   ```

## Development

### API Documentation (Sphinx)

- Edit files in `sphinx/api/`
- Build: `cd sphinx && make html`
- View: Open `sphinx/_build/html/index.html`

### User Guide (MkDocs)

- Edit files in `docs/`
- Preview: `mkdocs serve`
- Build: `mkdocs build`

## Automated Deployment

Documentation is automatically built and deployed to GitHub Pages when:
1. Changes are pushed to the main branch
2. Pull requests are created/updated
3. Manual trigger via GitHub Actions

The deployed documentation will be available at: `https://[username].github.io/pawspace/`

## Writing Guidelines

1. **API Documentation**
   - Use clear, consistent terminology
   - Include request/response examples
   - Document all parameters
   - Explain error scenarios

2. **User Guide**
   - Write in a clear, friendly tone
   - Include screenshots where helpful
   - Provide step-by-step instructions
   - Keep content up-to-date

## Contributing

1. Create a new branch
2. Make your changes
3. Build documentation locally to verify
4. Create a pull request
5. Wait for the documentation preview
6. Request review
