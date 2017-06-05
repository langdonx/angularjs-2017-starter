export default {
    name: 'clickTracker',
    directive: ($log) => {
        'ngInject';

        return {
            restrict: 'A',
            link: (scope, element) => {
                function getTagChain(target, text = '') {
                    const additionalText = ((text) ? ` > ${text}` : '');

                    if (!target) {
                        return `[deleted-element] > ${text}`;
                    }
                    else if (target === element[0]) {
                        return `${element[0].tagName} > ${text}`;
                    }
                    else if (target.tagName === 'BODY') {
                        return `BODY > ${text}`;
                    }

                    return getTagChain(target.parentElement, `${target.tagName}${additionalText}`);
                }

                function onElementClick(e) {
                    $log.info('clicked', getTagChain(e.target));
                }

                element[0].addEventListener('click', onElementClick);

                scope.$on('$destroy', () => {
                    element[0].removeEventListener('click', onElementClick);
                });
            },
        };
    },
};
