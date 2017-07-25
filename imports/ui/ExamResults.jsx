import React from 'react'
import Average from './Average'
import Score_2016 from './Score_2016'

const createSelectButtons = (nameList, className, handleFunction) =>  {
	return (
		<div className='select_buttons'>
			{nameList.map((obj, i) => {
				return <button className={className} data-filter-name={obj} key={i} onClick={handleFunction}> {obj} </button>
			})}
		</div>
	)
}

function toggle_to_array(curr_array, stat_array, elem) {
	var curr_index = curr_array.indexOf(elem)
	if(curr_index >= 0) {
		curr_array.splice(curr_index, 1);
	} else {
		stat_index = stat_array.indexOf(elem)
		var pushed = false;
		var i; 
		for(i=0; i<curr_array.length; i++){
			if(stat_array.indexOf(curr_array[i]) > stat_index){
				if(i == 0) {
					curr_array.splice(0, 0, elem)
				}
				else {
					curr_array.splice(i, 0, elem)
				}
				pushed = true;
				break;
			}
		}
		if(!pushed){
			curr_array.push(elem)
		}
	}
}

function toggle_clicked_classname(curr_array, elem, elem_value) {
	var curr_index = curr_array.indexOf(elem_value)
	if(curr_index >= 0) {
		elem.classList.add('not-selected')
	} else {
		elem.classList.remove('not-selected')
	}
}

const ExamResults = React.createClass({
	statics: {
		subjectList: [
			'ბიოლოგია', 'გეოგრაფია', 'გერმანული', 'ინგლისური',
			'ისტორია', 'მათემატიკა', 'რუსული', 'ფიზიკა',
			'ქართული ენა', 'ქართული ენა და ლიტ.', 'ქიმია'
		],
		yearList: [
			2011, 2012, 2013, 2014, 2015, 2016
		],
		languageList: [
			'ქართული', 'აზერბაიჯანული', 'რუსული', 'სომხური', 'არაქართული'
		]
	},

	select_options: {},

	getInitialState () {
		this.select_options.subjectList = ExamResults.subjectList.slice()
		this.select_options.yearList = ExamResults.yearList.slice()
		this.select_options.languageList = ExamResults.languageList.slice()
		return {
			highchart: <Average data={this.props.data} selected_options={this.select_options}/>
		}
	},

	handleSelectButton (event) {
		var class_list = event.target.classList
		var value = event.target.getAttribute('data-filter-name')
		var options = this.select_options
		if(class_list.contains('year_buttons')) {
			toggle_clicked_classname(options.yearList, event.target, parseInt(value))
			toggle_to_array(options.yearList, ExamResults.yearList, parseInt(value))
		} else if(class_list.contains('subject_buttons')) {
			toggle_clicked_classname(options.subjectList, event.target, value)
			toggle_to_array(options.subjectList, ExamResults.subjectList ,value)
		} else {
			toggle_clicked_classname(options.languageList, event.target, value)
			toggle_to_array(options.languageList, ExamResults.languageList, value)
		}

		this.setState({highchart: <Average data={this.props.data} selected_options={options}/>})
	},

	handleHighchartChange (event) {
		if(event.target.id == 'average') {
			this.setState({highchart: <Average data={this.props.data} selected_options={this.select_options}/>})
		} else if(event.target.id == 'score_2016') {
			this.setState({highchart: <Score_2016 data={this.props.data} selected_options={this.select_options}/>})
		}
	},

	render () {
		return (
		  <div className='exam_results'>
		  	<section className='select_buttons_wrapper'>
		  		{createSelectButtons(ExamResults.yearList, 'year_buttons', this.handleSelectButton)}
		  		{createSelectButtons(ExamResults.subjectList, 'subject_buttons', this.handleSelectButton)}
		  		{createSelectButtons(ExamResults.languageList, 'lang_buttons', this.handleSelectButton)}
		  	</section>

		  	<section className='highchart'>
		  		{this.state.highchart}
		  	</section>

		  	<section className='option_buttons'>
		      	<button id='average' onClick={this.handleHighchartChange}> Average Scores </button>
				<button id='score_2016' onClick={this.handleHighchartChange}> 2016 Scores </button>
		  	</section>
		  </div>
		)
	}
})

export default ExamResults