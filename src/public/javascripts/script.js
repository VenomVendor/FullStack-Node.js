const cardInit = () => {
    const menuTrigger = $('[data-card-menu]');
    const backTrigger = $('[data-card-back]');

    menuTrigger.add(backTrigger).on('click', (e) => {
        e.stopPropagation();
        $(e.currentTarget).parents('.card').toggleClass('show-menu');
    });
};

const attachListeners = () => {
    $('.delete').on('click', (e) => {
        e.stopPropagation();
        const $card = $(e.currentTarget).parents('.card');
        const id = $card.data('id');
        $card.addClass('disabled');

        $.ajax(`/v1/del/${id}`, {
            type: 'delete',
            dataType: 'json',
            success: (data) => {
                if (data.status === 'success') {
                    $card.addClass('hide');
                    if ($card.hasClass('no-click')) {
                        window.location.href = '../users';
                    }
                } else {
                    $card.removeClass('disabled');
                    console.log(`Unable to delete. ${data.message}`);
                }
            },
            error: (jqXHR) => {
                $card.removeClass('disabled');
                console.log(`Unable to delete.${jqXHR.responseJSON.message}`);
            }
        });
    });

    $('.card').not('.no-click').on('click', (e) => {
        const $card = $(e.currentTarget);
        const id = $card.data('id');
        window.location.href = `user/${id}`;
    });
};

const init = () => {
    cardInit();
    attachListeners();
};

init();
