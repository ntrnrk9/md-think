$(document).ready(function () {
    $('body').on('click', ".toggle-word", function () {
        $(this).parent().find('.textarea-form, .form-search-person').slideToggle(300);
        $(this).find('span .fa').toggleClass('fa-minus').toggleClass('fa-plus');
    });
});
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);