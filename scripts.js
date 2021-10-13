$(document).ready(() => {
  const quoteCarousel = new QuoteCarousel('quotes');
  const pipularTutorials = new PopularTutorials('popularTutorialsTarget');
});

// util function from a StackOverflow answer
// source: https://stackoverflow.com/questions/4492385/convert-simple-array-into-two-dimensional-array-matrix
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
    // added 1 sec timeout to see loading indicator
    setTimeout(() => {
      $.get('https://smileschool-api.hbtn.info/quotes', (data) => {
        this._data = data;
      }).done(() => this.render());
    }, 1000);
  };

  static previousBtn = `<a class="carousel-control-prev" href="#quotesCarousel" role="button" data-slide="prev">
  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  <span class="sr-only">Previous</span>
</a>`;

  static nextBtn = `<a class="carousel-control-next" href="#quotesCarousel" role="button" data-slide="next">
<span class="carousel-control-next-icon" aria-hidden="true"></span>
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

class PopularTutorials {
  _target;
  _data = [];

  constructor(target) {
    this._target = target;

    this.getData = this.getData.bind(this);
    this.render = this.render.bind(this);

    this.getData();
  }

  getData = () => {
    // added 1 sec timeout to see loading indicator
    setTimeout(() => {
      $.get('https://smileschool-api.hbtn.info/popular-tutorials', (data) => {
        this._data = data;
      }).done(() => this.render());
    }, 1000);
  };

  static previousBtn = `<a class="carousel-control-prev" href="#popularTutorialsCarousel" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>`;

  static nextBtn = `<a class="carousel-control-next" href="#popularTutorialsCarousel" role="button" data-slide="next">
  <span class="carousel-control-next-icon" aria-hidden="true"></span>
  <span class="sr-only">Next</span>
  </a>`;

  static star = `<span class="text-primary holberton_school-icon-star"></span>`;

  static TutorialCard = (item, active = false) => {
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
          $('<i>').addClass('text-white').text(item.title),
          $('<img width="48px" height="48px">')
            .addClass('img-circle')
            .addClass('mr-3')
            .attr('src', item.author_pic_url),
          $('<author>').addClass('text-primary').text(item.author)
        ),
        $('<div class="row pl-4 pb-2 justify-content-center">').append(
          $('<div class="col-8">').append(
            [...Array(item.star).keys()].map((s) => PopularTutorials.star)
          )
        ),
        $('<div class="col-4 text-primary">').text(item.duration)
      );
    return card;
  };

  render = () => {
    const targetElem = $(`#${this._target}`) || $('body');
    const elem = $('<div id="popularTutorialsCarousel" data-ride="carousel">')
      .addClass('carousel')
      .addClass('slide')
      .append($('<div>').addClass('carousel-inner'));

    const cards = listToMatrix(
      this._data.map((item, index) =>
        PopularTutorials.TutorialCard(item, index === 0)
      ),
      3
    );

    const slides = cards.map((cardRow, index) => {
      const slide = $('<div>').addClass('carousel-item');
      index === 0 && slide.addClass('active');
      const container = $('<div>').addClass('container');
      const row = $('<div>').addClass('row');
      cardRow.forEach((card) =>
        row.append($('<div class="col-4">').append(card))
      );
      container.append(row);
      slide.append(container);
      return slide;
    });
    elem.append(slides);
    targetElem.empty().append(elem);
    targetElem.append(PopularTutorials.previousBtn, PopularTutorials.nextBtn);
  };
}
