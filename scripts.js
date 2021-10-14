/**
 * listToMatrix - util function from SO used to group cards in carousel slides
 * source: https://stackoverflow.com/questions/4492385/convert-simple-array-into-two-dimensional-array-matrix
 */
function listToMatrix(list, elementsPerSubArray) {
  var matrix = [],
    i,
    k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}

const breakpoints = {
  sm: 576,
  md: 786,
  lg: 992,
  xl: 1200,
};
/**
 * getCurrentBreakpoint - util function to get Bootstrap window size (xs, sm, md, lg, xl)
 */
function getCurrentBreakpoint() {
  const width = $(document).width();
  return width < 576
    ? 'xs'
    : Object.keys(breakpoints)
        .filter((bp) => width >= breakpoints[bp])
        .reverse()[0];
}

$(document).ready(() => {
  let currentBP = getCurrentBreakpoint();

  const quoteCarousel = $('#quotes').length
    ? new QuoteCarousel('quotes')
    : null;

  const searchForm = $('#results').length ? new SearchForm('results') : null;

  const popularTutorials = $('#popularTutorialsTarget').length
    ? new VideoCarousel(
        'popularTutorialsCarousel',
        'popularTutorialsTarget',
        'https://smileschool-api.hbtn.info/popular-tutorials',
        currentBP
      )
    : null;
  const latestVideos = $('#latestVideosTarget').length
    ? new VideoCarousel(
        'latestVideosCarousel',
        'latestVideosTarget',
        'https://smileschool-api.hbtn.info/latest-videos',
        currentBP
      )
    : null;

  $(window).resize(() => {
    const newBP = getCurrentBreakpoint();
    // handle re-renders for responsive components
    if (newBP !== currentBP) {
      currentBP = newBP;
      popularTutorials && popularTutorials.rerender(newBP);
      latestVideos && latestVideos.rerender(newBP);
    }
  });
});

class QuoteCarousel {
  _target;
  _data = [];

  constructor(target) {
    this._target = target;

    this.getData = this.getData.bind(this);
    this.render = this.render.bind(this);

    this.getData();
  }

  getData = () => {
    $.get('https://smileschool-api.hbtn.info/quotes', (data) => {
      this._data = data;
    }).done(() => this.render());
  };

  static previousBtn = `<a class="carousel-control-prev" href="#quotesCarousel" role="button" data-slide="prev">
  <span class="holberton_school-icon-arrow_4 carousel-arrow"></span>
  <span class="sr-only">Previous</span>
</a>`;

  static nextBtn = `<a class="carousel-control-next" href="#quotesCarousel" role="button" data-slide="next">
<span class="holberton_school-icon-arrow_3 carousel-arrow"></span>
<span class="sr-only">Next</span>
</a>`;
  static QuoteItem = (item, active = false) => {
    const elem = $('<div>').addClass('carousel-item');
    active && elem.addClass('active');
    const container = $('<div>')
      .addClass('container')
      .addClass('p-2')
      .append(
        $('<div class="col-xs-12 col-sm-3 text-right">').append(
          $('<img width="100" height="100">')
            .addClass('img-circle')
            .attr('src', item.pic_url)
        ),
        $('<div class="col-xs-12 col-sm-9 text-left">').append(
          $('<p>').addClass('text-white').text(item.text),
          $('<h6>').addClass('mb-0').text(item.name),
          $('<i>').addClass('text-white').text(item.title)
        )
      );
    elem.append(container);
    return elem;
  };

  render = () => {
    const targetElem = $(`#${this._target}`) || $('body');
    const elem = $('<div id="quotesCarousel" data-ride="carousel">')
      .addClass('carousel')
      .addClass('slide')
      .append($('<div>').addClass('carousel-inner'));
    const quotes = this._data.map((item, index) =>
      QuoteCarousel.QuoteItem(item, index === 0)
    );
    elem.append(quotes, QuoteCarousel.previousBtn, QuoteCarousel.nextBtn);
    targetElem.empty().append(elem);
  };
}

const TutorialCard = (item) => {
  const card = $('<div>')
    .addClass('card')
    .addClass('mb-2')
    .append(
      $('<div class="card-img-wrapper">').append(
        $('<img>').addClass('card-img-top').attr('src', item.thumb_url)
      ),
      $('<div class="card-body">').append(
        $('<h4>').addClass('card-title').text(item.title),
        $('<p>').addClass('card-text').text(item['sub-title']),
        $('<img width="48px" height="48px">')
          .addClass('img-circle')
          .addClass('mr-3')
          .attr('src', item.author_pic_url),
        $('<author>').addClass('text-primary').text(item.author)
      ),
      $('<div class="row pl-4 pb-2 justify-content-center">').append(
        $('<div class="col-8">').append(
          [...Array(item.star).keys()].map((s) => VideoCarousel.star)
        ),
        $('<div class="col-4 text-primary">').text(item.duration)
      )
    );
  return card;
};

class VideoCarousel {
  _id;
  _target;
  _dataURL;
  _cols = 1;
  _data = [];
  _cards = [];
  static breakpointCols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 };

  constructor(id, target, dataURL, currentBP) {
    this._id = id;
    this._target = target;
    this._dataURL = dataURL;
    this._cols = VideoCarousel.breakpointCols[currentBP];
    this.getData = this.getData.bind(this);
    this.render = this.render.bind(this);
    this.rerender = this.rerender.bind(this);

    this.getData();
  }

  getData = () => {
    // added 1 sec timeout to see loading indicator
    $.get(this._dataURL, (data) => {
      this._data = data;
    }).done(() => {
      this._cards = this._data.map((item) => TutorialCard(item));
      this.render();
    });
  };

  static previousBtn = (
    id
  ) => `<a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
    <span class="holberton_school-icon-arrow_4 carousel-arrow"></span>
    <span class="sr-only">Previous</span>
  </a>`;

  static nextBtn = (
    id
  ) => `<a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
  <span class="holberton_school-icon-arrow_3 carousel-arrow"></span>
  <span class="sr-only">Next</span>
  </a>`;

  static star = `<span class="text-primary holberton_school-icon-star"></span>`;

  rerender = (bp) => {
    this._cols = VideoCarousel.breakpointCols[bp];
    this.render();
  };

  render = () => {
    const targetElem = $(`#${this._target}`) || $('body');
    const elem = $(`<div id=${this._id} data-ride="carousel">`)
      .addClass('carousel')
      .addClass('slide')
      .append($('<div>').addClass('carousel-inner'));

    const slides = listToMatrix(this._cards, this._cols).map(
      (cardRow, index) => {
        const slide = $('<div>').addClass('carousel-item');
        index === 0 && slide.addClass('active');
        const container = $('<div>').addClass('container-fluid');
        const row = $('<div>').addClass('row');
        cardRow.forEach((card) =>
          row.append(
            $('<div>')
              .addClass(`col-${12 / this._cols}`)
              .append(card)
          )
        );
        container.append(row);
        slide.append(container);
        return slide;
      }
    );

    elem.append(slides);

    targetElem.empty().append(elem);
    elem.append(
      VideoCarousel.previousBtn(this._id),
      VideoCarousel.nextBtn(this._id)
    );
  };
}

class SearchForm {
  _target;
  _q = '';
  _topic = 'all';
  _sort = 'most_popular';

  _count = 0;
  _data = [];

  constructor(target) {
    this._target = target;

    this.getResults = this.getResults.bind(this);
    this.renderResults = this.renderResults.bind(this);

    $('#keywords').keyup((e) => {
      if (e.target.value != this._q) {
        this._q = e.target.value;
        this.getResults();
      }
    });
    $('#topic')
      .next()
      .children()
      .click((e) => {
        if ($(e.target).attr('data-value') != this._topic) {
          this._topic = $(e.target).attr('data-value');
          $('#topic').attr('value', this._topic).text($(e.target).text());
          this.getResults();
        }
      });
    $('#sort')
      .next()
      .children()
      .click((e) => {
        if ($(e.target).attr('data-value') != this._sort) {
          this._sort = $(e.target).attr('data-value');
          $('#sort').attr('value', this._sort).text($(e.target).text());
          this.getResults();
        }
      });

    this.getResults();
  }

  getResults = () => {
    $.get('https://smileschool-api.hbtn.info/courses', {
      q: this._q,
      topic: this._topic,
      sort: this._sort,
    }).done(({ courses }) => {
      this._data = courses;
      this._count = courses.length;
      this.renderResults();
    });
  };

  renderResults = () => {
    $('#resultCount').text(`${this._count} video${this._count != 1 && 's'}`);
    $(`#${this._target}`).empty();
    $(`#${this._target}`).append(
      this._data.map((c) =>
        $('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">').append(
          TutorialCard(c)
        )
      )
    );
  };
}
