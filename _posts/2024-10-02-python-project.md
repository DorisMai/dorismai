---
title: 'How to make a Python project'
date: 2024-10-02
modified: 2024-12-02
permalink: /posts/python-project/
color_tag: "study-notes"
tags:
  - coding
---

The resources/documentations out there can be overwhelming for scientific/academic software development. The general concept of building, managing dependencies, and CI/CD might be gently introduced/reviewed in this [lecture](https://missing.csail.mit.edu/2020/metaprogramming/), but one could probably find resources more updated and specific to Python elsewhere.

To get a rough idea on when to do what in the whole process, [this blog post](https://alexkyllo.com/posts/python-package/) is very concise to start with. For a second round of reading, [this blog post](https://mathspp.com/blog/how-to-create-a-python-package-in-2022) is a more detailed walkthrough. Before doing anything, it's helpful to also learn about each specific steps and popular tools.

There are tools such as [Cookiecutter](https://cookiecutter.readthedocs.io/en/stable/) that can create a fairly comprehensive project templates. For learning purposes, I would like to begin with what I consider minimal/essential.

# Example architecture of a package:
```
packaging_tutorial/
├── LICENSE
├── configuration_file
├── README.md
├── src/
│   └── example_package/
│       ├── __init__.py
│       └── example.py
└── tests/
```
# Breakdown of the components
## Project configuration file
Example file formats:
- pyproject.toml
- setup.cfg
This file mainly specifies what packages (and their versions) are needed to develop your own package, but also records other metadata such as build and test tools used. A build backend tool such as `setuptools` perform the actual package building using the configuration file and can be called by frontend tools. Build frontend tools include `pip` and `build`. 

## Dev workflow tools
My understanding is that they are mostly needed to manage different virtual environments to resolve package dependency issues, but often comes with powerful general support of other tools for testing and documentation etc. 
Popular workflow tools include:
- `poetry`
- `tox`
While `tox` is particularly well-known for testing against several environments (e.g. different version of Python), it seems a bit daunting for me, but [this tutorial](https://christophergs.com/python/2020/04/12/python-tox-why-use-it-and-tutorial/) and [this tutorial](https://www.seanh.cc/2018/09/01/tox-tutorial/#why-tox-is-confusing-at-first) seems helpful if you are interested. For my first attempt, I went with `poetry`, but I have seen quite some friction points too. Perhaps plain old setuptools is still the way to go?

## Tests
Popular tools include:
- `pytest`
- `nose`
Tests can be referenced by the project configuration file and for `pytest`, has a naming convention of `test_*.py` or `*_test.py`. Note that `pytest` comes with `poetry`. Once starting writing tests, it would be helpful to learn about fixtures and how to aggregate them in a `conftest.py` file.

## GitHub actions workflow
Set up a workflow of testing that's triggered by version control related events such as push or PR. In this [example from Careless](https://github.com/rs-station/careless/blob/main/.github/workflows/build.yml), upon even triggering, it first sets up the python environment, install dependency, run `pytest`, and uploads code coverage of the test.

## Documentation
Popular tools include:
- sphinx
- mkdocs
Automatically generate documentation from python docstrings in your code. 

---
# Further reading
- More serious introductions and demos of Python packaging:
	- [intro blog post](https://drivendata.co/blog/python-packaging-2023)
	- [technical demos of packaging](https://codeberg.org/buhtz/tech-demo-python-packaging)
	- [official guide/documentation](https://packaging.python.org/en/latest/)
- Other references:
	- [this knowledge base](https://sinoroc.github.io/kb/python/packaging.html) with miscellaneous tables comparing different tools 

---
# Additional notes
## Codecov
Reports code coverage of testing.
- Especially for private repo, need to install and configure, generate repo secret for token
- Need .coveragerc file to specify which directory to get coverage on

## Renovate
Manages dependency updates.
- Also need to install and configure, go through the tutorial at the mean time
- Change renovate.json as needed to adjust updates frequency for example
- In the future, might be useful to use the `automerge` features for small/minor updates
