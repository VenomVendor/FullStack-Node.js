const cardInit = () => {
    const menuTrigger = $('[data-card-menu]');
    const backTrigger = $('[data-card-back]');

    menuTrigger.on('click', (e) => {
        $(e.currentTarget).parents('.card').toggleClass('show-menu');
    });
    backTrigger.on('click', (e) => {
        $(e.currentTarget).parents('.card').toggleClass('show-menu');
    });
};

const attachListeners = () => {
    $('.delete').on('click', (e) => {
        const $card = $(e.currentTarget).parents('.card');
        $card.addClass('disabled');
        const id = $card.data('id');
        $.get(`/v1/del/${id}`)
            .success((data) => {
                if (data.status === 'success') {
                    $card.addClass('hide');
                } else {
                    $card.removeClass('disabled');
                    console.log(`Unable to delete. ${data.message}`);
                }
            })
            .error((jqXHR) => {
                $card.removeClass('disabled');
                console.log(`Unable to delete.${jqXHR.responseJSON.message}`);
            });
    });
};

const init = () => {
    cardInit();
    attachListeners();
};

init();
