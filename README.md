# angular-translate-gui

*Currently under development - expect frequent changes*

Simple GUI to produce translation files for angular-translate more efficiently and in a controlled way.

It's goal is to keep track of changes in translations file during an
agile development workflow. Frequent additions and/or changes in
translaions files make it hard for translators (possibly non-developers)
to know which sections need revision.

As further help each translation key can be described
through a comment and visualized by an example to provide context for
translators.

All data is stored inside a MongoDB. A 'main' language can be defined
(currently defaults to English) which is used to track the 'dirtyness'
of individual translation items. E.g. once an English item changes, all
other languages are marked as 'dirty' - which means being in need of
further revision.

## Install

Make sure you have node, bower and grunt installed!
You also need a running MongoDB server (right now it needs to be at port 27017, its default).

```
npm install
bower install
```

You can start building up translation files immediately if you run

```
grunt serve
```

This will open your browser at [http://localhost:9000](http://localhost:9000).

If you already have `angular-translate` locale files available you can
seed them to the database by using the `importer` script, accessible
from this repository's root directory.

```
node importer.js PATH_TO_THE_DIRECTORY_WITH_LOCALE_FILES
```
