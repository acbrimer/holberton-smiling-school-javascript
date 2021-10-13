$(document).ready(() => {
  const quoteCarousel = new QuoteCarousel('quotes');
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
