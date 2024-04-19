---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
title: Math Scripts
---
<article class="markdown-body">
  <p>There isn't much here. Just a small (but hopefully growing) collection of math-related scripts.</p>
  <dl>
  {% assign sorted_pages = site.posts | sort: 'date' %}
  {% assign categories = sorted_pages | map: 'category' | uniq %}

  {% for nav_page in sorted_pages %}
    {% if nav_page.layout != 'redirect' %}
      <dt><a href="{{ nav_page.url | relative_url }}">{{ nav_page.title }}</a></dt>
      {% if nav_page.description %}<dd>{{ nav_page.description }}</dd>{% endif %}
    {% endif %}
  {% endfor %}
  </dl>
</article>

