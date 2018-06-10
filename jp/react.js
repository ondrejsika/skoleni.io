var ReactApp = {
    cbs: [],
    run: function () {
        var filter = {
            node: 1,
            php: 2,
            javascript: 3,
            react: 4
        };
        var $terms = $('#terms');
        var course = filter[$terms.data('course')];
        $.get('https://www.eduexpert.cz/feed.json', (data) => {
            var courseList = data.filter((item) => {
                return item.course_id == course;
            })
            this.cbs.map(callback => {
                callback(courseList);
            });
        });
    }

};



class Terms extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            courses: null
        };
        ReactApp.cbs.push((data) => {
            this.setState({courses: data});
        })
    }


    renderTerms(){
        return this.state.courses.map(course => {
            return (
                <tr className="row-2 even" key={course.date}>
                    <td className="column-2">{course.date_words}, {course.schedule}</td>
                    <td className="column-3">{course.price}</td>
                </tr>
            )
        })
    }

    render() {
        if(!this.state.courses){
            return <div className="spinner"></div>
        } else {
            return (
                <div>
                    <h3>Aktuálně vypsané termíny</h3>
                    <table id="tablepress-3" className="tablepress tablepress-id-3 table">
                        <thead>
                        <tr className="row-1 odd">
                            <th className="column-3">Datum</th>
                            <th className="column-4" style={{width: 100}}>Cena</th>
                        </tr>
                        </thead>
                        <tbody className="row-hover">
                        {this.renderTerms()}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}

class SelectBox extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            courses: []
        };
        ReactApp.cbs.push((data) => {
            this.setState({courses: data});
        })
    }

    renderOptions(){
        if(this.state.courses.length === 0){
            return <option value="open">Otevřený termín</option>
        } else {
            return this.state.courses.map(item => {
                return <option key={item.date} value={item.date.substr(0, 10)}>{item.date_words} - {item.price}</option>
            });
        }
    }

    formatData(date){
        var d = new Date(date);
    }

    render(){
        return (
            <React.Fragment>
                <label htmlFor="sterms">Vyberte termín</label>
                <select className="form-control" id="sterms">
                    <option value="">termín / místo</option>
                    {this.renderOptions()}
                </select>
            </React.Fragment>
        );
    }
}


ReactApp.run();


ReactDOM.render(<Terms />, document.getElementById('terms'));
ReactDOM.render(<SelectBox />, document.getElementById('terms-selectbox'));

// form submit handler

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

var registrationButton = $('#registration-submit');
registrationButton.click(function (e) {
    e.preventDefault();
    var $terms = $('#terms');
    var values = {
        course: $terms.data('course'),
        name: $('#name').val(),
        date: $('#sterms').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        message: $('#note').val(),
        from: 'sika'
    };

    if(!values.date){
        alert('Vyberte prosím termín.');
    } else if(values.name.length < 2){
        alert('Zadejte prosím jméno účastníka.');
    } else if(values.phone.length < 9){
        alert('Zadejte prosím kontaktní telefon.');
    } else if(!isEmail(values.email)){
        alert('Zadejte prosím kontaktní email.');
    } else {
        $.post('https://www.eduexpert.cz/api/registration', values, (data) => {
            if(data.statusCode == 201){
                alert('Děkujeme, Vaše přihláška byla odeslána, brzo se Vám ozveme.');
                window.location.replace('https://skoleni.io');
            } else {
                alert('Omlouváme se, něco se pokazilo. Kontaktujte nás prosím emailem.');
            }
        });
    }
});
