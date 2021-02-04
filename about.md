---
layout: default
title: About
---
# refs
Su3ndo lab references aggregator and discussion

### Contributor
<ul>
  {% for author in site.authors %}
    <li>
      <b><a href="{{site.baseurl}}{{ author.url }}">{{ author.name }}</a></b>
			({{ author.position }})
    </li>
  {% endfor %}
</ul>